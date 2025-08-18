import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';

// Reusing the Auth components from LoginPage
const AuthFormContainer = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a092d] to-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8"
    >
      {children}
    </motion.div>
  </div>
);

const AuthInput = (props) => (
  <input
    {...props}
    className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  />
);

const AuthButton = ({ children, disabled, onClick }) => (
  <motion.button
    type="button" // Changed to button to prevent form submission on step change
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full py-3 mt-4 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </motion.button>
);


function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', college: '', course: '', year: '', hometown: '', email: '', 
    phone: '', password: '', workingAt: '', personalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, name: formData.name, email: formData.email, phone: formData.phone,
        college: formData.college, course: formData.course, year: formData.year,
        hometown: formData.hometown, workingAt: formData.workingAt, personalInfo: formData.personalInfo,
        joiningDate: new Date(), status: 'pending',
      });
      
      setSuccess("Registration successful! Your account is now pending admin approval.");
    } catch (err) {
      setError(err.message);
      console.error("Error during registration: ", err);
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
  };

  return (
    <AuthFormContainer>
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Student Registration</h2>
      <p className="text-gray-400 mb-6 text-center">Join the BCM 2259 community.</p>

      {success ? (
        <p className="text-green-400 text-center text-lg mt-8">{success}</p>
      ) : (
        <form onSubmit={handleSubmit} className="overflow-hidden relative h-[450px]">
          <AnimatePresence>
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <h3 className="font-semibold text-white mb-4">Step 1: Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AuthInput type="text" name="name" placeholder="Full Name*" value={formData.name} onChange={handleChange} required />
                  <AuthInput type="password" name="password" placeholder="Password (min. 6 characters)*" value={formData.password} onChange={handleChange} required />
                  <AuthInput type="email" name="email" placeholder="Email ID*" value={formData.email} onChange={handleChange} required />
                  <AuthInput type="tel" name="phone" placeholder="Phone No*" value={formData.phone} onChange={handleChange} required />
                </div>
                <AuthButton onClick={nextStep}>Next</AuthButton>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <h3 className="font-semibold text-white mb-4">Step 2: Academic & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuthInput type="text" name="college" placeholder="College*" value={formData.college} onChange={handleChange} required />
                    <AuthInput type="text" name="course" placeholder="Course*" value={formData.course} onChange={handleChange} required />
                    <AuthInput type="text" name="year" placeholder="Year of Study*" value={formData.year} onChange={handleChange} required />
                    <AuthInput type="text" name="hometown" placeholder="Hometown Location*" value={formData.hometown} onChange={handleChange} required />
                </div>
                <div className="flex gap-4">
                    <AuthButton onClick={prevStep}>Back</AuthButton>
                    <AuthButton onClick={nextStep}>Next</AuthButton>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <h3 className="font-semibold text-white mb-4">Step 3: Additional Info (Optional)</h3>
                <div className="space-y-4">
                    <AuthInput type="text" name="workingAt" placeholder="Working At (e.g., Internship)" value={formData.workingAt} onChange={handleChange} />
                    <textarea name="personalInfo" placeholder="A little about yourself..." value={formData.personalInfo} onChange={handleChange} className="w-full h-24 bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
                </div>
                <div className="flex gap-4">
                    <AuthButton onClick={prevStep}>Back</AuthButton>
                    <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full py-3 mt-4 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg" disabled={loading}>
                      {loading ? 'Registering...' : 'Register'}
                    </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {error && <p className="text-red-400 text-sm mt-4 text-center absolute bottom-0 w-full">{error}</p>}
        </form>
      )}
    </AuthFormContainer>
  );
}

export default SignUpPage;
