const EventNotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
            <FaInfoCircle className="text-pink-500" size={48} />
            <h1 className="text-2xl font-bold text-white">Event Not Found</h1>
            <p className="text-slate-400">The event you are looking for does not exist or has been removed.</p>
            <Link href="/events">
                <Button color="secondary" startContent={<FaArrowLeft />}>
                    Back to Events
                </Button>
            </Link>
        </div>
    )
}