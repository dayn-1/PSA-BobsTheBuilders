import {signOut} from 'next-auth/react' 

export default function Navbar() {
  return (
    <main>
      <div className="bg-gray-700 h-12 flex flex-row items-center justify-center text-white grid-cols-2">
        <div className="mr-16 font-semibold font-poppins">
          Welcome to PortBros!
        </div>
        <div className="mx-8 font-poppins cursor-pointer hover:text-blue-300">
          Home
        </div>
        <div className="mx-8 font-poppins cursor-pointer hover:text-blue-300">
          <button onClick={()=> signOut()}>Sign Out</button>
        </div>
      </div>
    </main>
  );
}
