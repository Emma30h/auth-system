import { motion } from "framer-motion";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { Mail, User, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

function SignUpPage(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const {signup, error, isLoading} = useAuthStore();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate("/email-verification");
        } catch (error) {
            console.log(error);
        }
    }

    return(
       <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 20, y: 0}}
        transition={{duration: 0.5}}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
       >
            <div className="p-8">
                <h2 className="font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} >
                    <Input
                        icon={User}
                        type="text"
                        placeholder='Full Name'
                        value={name}
                        setValue={setName}
                    />
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder='Email'
                        value={email}
                        setValue={setEmail}
                    />
                    <Input
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder='Password'
                        value={password}
                        setValue={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                    {
                        error && <p className="text-red-500 font-semibold mt-2">{error}</p>
                    }
                    <PasswordStrengthMeter password={password}/>
                    <motion.button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        type="submit"
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <Loader className="animate-spin mx-auto"/> : "Sign up"
                        }
                    </motion.button>
                </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to={"/login"} className="text-green-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
       </motion.div>
    )
}

export default SignUpPage;