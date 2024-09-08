import Image from "next/image";

export default function NotFound() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
         

        <div className="flex gap-4 items-center flex-col ">
          
            <Image
              className="dark:invert border border-black"
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnRhaTF4cjNianh6bzNzcWFlMGJqZTUxZWlocGppajN1bmdwaHZ5diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d7rvF20PqNuGKSQGhf/giphy.gif"
              alt="not found image"
              width={200}
              height={200}
            />
           <h3>Page Not Found </h3> 
        </div>
      </main>
     
    </div>
  );
}
