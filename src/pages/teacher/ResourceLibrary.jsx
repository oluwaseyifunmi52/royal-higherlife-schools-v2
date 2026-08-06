const sampleResources = [
    { title: 'Multiplication Made Easy', className: 'Basic 3', subject: 'Mathematics', category: 'Video Lesson', status: 'Published', owner: 'Mrs. Johnson' },
    { title: 'Reading for Fun', className: 'Basic 1', subject: 'English', category: 'Story Book', status: 'Reviewed', owner: 'Mr. Adebayo' },
    { title: 'Science Activity Sheet', className: 'Basic 4', subject: 'Basic Science', category: 'Worksheet', status: 'Draft', owner: 'Miss Grace' },
]

export default function ResourceLibrary() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-white">Library Management</h1>
                    <p className="mt-3 text-lg text-slate-400">Upload books, worksheets, videos, and quizzes for the school digital library.</p>
                </div>
                <button className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Add New Resource</button>
            </div>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-xl font-semibold text-white">Add New Resource</h2>
                <p className="mt-2 text-sm text-slate-400">Teachers can add lessons, worksheets, and learning materials for their own classes and subjects.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Title" />
                    <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                        <option value="">Select Class</option>
                        <option>Basic 1</option>
                        <option>Basic 2</option>
                        <option>Basic 3</option>
                        <option>Basic 4</option>
                        <option>Basic 5</option>
                    </select>
                    <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Subject" />
                    <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                        <option value="">Select Category</option>
                        <option>Textbook</option>
                        <option>Reading Book</option>
                        <option>Story Book</option>
                        <option>Teacher Video Lesson</option>
                        <option>Children's Educational Video</option>
                        <option>Worksheet</option>
                        <option>Quiz</option>
                        <option>Audio Lesson</option>
                    </select>
                    <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-sm font-semibold text-white">Video Source</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                            <label className="flex items-center gap-2"><input type="radio" name="videoSource" /> Upload Video</label>
                            <label className="flex items-center gap-2"><input type="radio" name="videoSource" /> YouTube Link</label>
                        </div>
                        <input className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="YouTube Link" />
                    </div>
                    <textarea className="min-h-[120px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" placeholder="Description" />
                    <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" type="file" />
                    <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" type="file" />
                    <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
                        <p className="font-semibold text-white">Visible To</p>
                        <div className="mt-3 flex flex-wrap gap-4">
                            {['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'].map((grade) => (
                                <label key={grade} className="flex items-center gap-2"><input type="checkbox" /> {grade}</label>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4">
                            {['English', 'Mathematics', 'Basic Science', 'Computer Studies', 'CRS'].map((subject) => (
                                <label key={subject} className="flex items-center gap-2"><input type="checkbox" /> {subject}</label>
                            ))}
                        </div>
                    </div>
                    <button className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 md:col-span-2">Publish Resource</button>
                </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-xl font-semibold text-white">Manage Library</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {sampleResources.map((resource) => (
                        <div key={resource.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">{resource.category}</p>
                            <h3 className="mt-3 text-lg font-semibold text-white">{resource.title}</h3>
                            <p className="mt-2 text-sm text-slate-400">Class: {resource.className}</p>
                            <p className="mt-1 text-sm text-slate-400">Subject: {resource.subject}</p>
                            <p className="mt-1 text-sm text-slate-400">Uploaded by: {resource.owner}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-300">{resource.status}</span>
                                <button className="text-sm font-semibold text-blue-300">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
