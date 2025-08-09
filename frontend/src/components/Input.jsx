import { Eye, EyeOff } from "lucide-react";

const Input = ({icon: Icon, ...props})=>{
    const isPasswordField = typeof props.showPassword !== "undefined" && typeof props.setShowPassword === "function";
    return(
        <div
        className="relative mb-6"
        >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon className="size-5 text-green-500"/>
            </div>
            <input 
                className="w-full pl-10 pr-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200" 
                placeholder={props.placeholder}
                type={props.type}
                value={props.value}
                onChange={(e)=>{props.setValue(e.target.value)}}
            />
            {
                isPasswordField && (
				    <button
					    type="button"
					    onClick={() => props.setShowPassword(!props.showPassword)}
					    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
				    >
					    {props.showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
				    </button>
			    )
            }
        </div>
    )
}

export default Input;