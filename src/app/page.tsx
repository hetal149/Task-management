
import SignIn from "./sign-in/page";


export default function Home() {


  return (
    <div className="flex  items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between sm:px-16 px-2 bg-white  sm:items-start">
        <SignIn/>
      </main>
    </div>
  );
}
