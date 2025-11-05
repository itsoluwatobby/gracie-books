import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

type PasswordProps = {
  label: string;
  name: string;
  pwd: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Passwords: React.FC<PasswordProps> = (
  { pwd, name, label, handleChange }
) => {
  const [reveal, setReveal] = useState(false);

  return (
    <>
      <label className="block text-gray-700 mb-1" htmlFor="confirmPassword">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 right-3 pl-3 flex items-center pointer-eventsnone">
          {
            reveal ?
            <EyeOffIcon className="h-5 w-5 text-gray-400 cursor-pointer" 
            onClick={() => setReveal(false)}
            />
            :
            <EyeIcon className="h-5 w-5 text-gray-400 cursor-pointer" 
            onClick={() => setReveal(true)}
            />
          }
        </div>
        <input
          id={name}
          type={reveal ? "text" : "password"}
          name={name}
          value={pwd}
          onChange={handleChange}
          className="pl-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="********"
          autoComplete="off"
          required
        />
      </div>
    </>
  )
}