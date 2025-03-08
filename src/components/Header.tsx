export default function Header() {
    return (
        <header className='bg-slate-200 dark:bg-slate-950 text-center text-slate-950 dark:text-slate-200 py-4'>
            <h1 className='font-bold text-2xl'>Infant Sleep Calculator</h1>
            <span className='text-md italic'>
                {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </span>
        </header>
    );
}
