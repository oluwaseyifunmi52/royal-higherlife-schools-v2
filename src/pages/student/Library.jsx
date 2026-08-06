import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBook, FiBookOpen, FiBookmark, FiClock, FiDownload, FiFileText, FiHeart, FiPlayCircle, FiSearch, FiVideo } from 'react-icons/fi'

const featuredBooks = [
    { title: 'Reading for Fun', type: 'Story Book', level: 'Basic 1', description: 'Reading practice with audio narration and a guided quiz.' },
    { title: 'Numbers in Practice', type: 'Textbook', level: 'Basic 2', description: 'Interactive maths lessons with printable worksheets.' },
    { title: 'Science Around Us', type: 'Video Lesson', level: 'Basic 3', description: 'A science lesson package with explanation and practice.' },
]

const classResources = {
    'Basic 1': {
        'Textbooks': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'CRS', 'Handwriting', 'Phonics'],
        'Reading Books': ['Beginner Readers', 'Reading Comprehension', 'Phonics Readers', 'Picture Books', 'Early Readers'],
        'Story Books': ['Bible Stories', 'African Folktales', 'Moral Stories', 'Animal Stories', 'Fairy Tales'],
        'Video Lessons': ['Mathematics Lessons', 'English Lessons', 'Science Lessons', 'Phonics Lessons', 'Handwriting Lessons'],
        "Children's Videos": ['Alphabet Songs', 'Number Songs', 'Nursery Rhymes', 'Educational Cartoons', 'Moral Lessons'],
        'Worksheets': ['Printable Worksheets', 'Homework Sheets', 'Practice Exercises', 'Revision Papers'],
        'Interactive Learning': ['Educational Games', 'Quizzes', 'Flash Cards', 'Puzzles'],
        'Audio Learning': ['Story Audio', 'Bible Audio', 'Pronunciation Practice', 'Reading Practice'],
    },
    'Basic 2': {
        'Textbooks': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'CRS', 'Handwriting', 'Phonics'],
        'Reading Books': ['Beginner Readers', 'Reading Comprehension', 'Phonics Readers', 'Picture Books', 'Early Readers'],
        'Story Books': ['Bible Stories', 'African Folktales', 'Moral Stories', 'Adventure Stories', 'Character Building Stories'],
        'Video Lessons': ['Mathematics Lessons', 'English Lessons', 'Science Lessons', 'Computer Lessons', 'CRS Lessons'],
        "Children's Videos": ['Alphabet Songs', 'Number Songs', 'Nursery Rhymes', 'Science Experiments', 'Health & Hygiene'],
        'Worksheets': ['Printable Worksheets', 'Homework Sheets', 'Practice Exercises', 'Revision Papers'],
        'Interactive Learning': ['Educational Games', 'Quizzes', 'Flash Cards', 'Memory Games'],
        'Audio Learning': ['Story Audio', 'Bible Audio', 'Pronunciation Practice', 'Reading Practice'],
    },
    'Basic 3': {
        'Textbooks': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'CRS', 'Handwriting', 'Phonics'],
        'Reading Books': ['Reading Comprehension', 'Phonics Readers', 'Picture Books', 'Early Readers', 'Chapter Books'],
        'Story Books': ['Bible Stories', 'African Folktales', 'Moral Stories', 'Adventure Stories', 'Fairy Tales'],
        'Video Lessons': ['Mathematics Lessons', 'English Lessons', 'Science Lessons', 'Computer Lessons', 'CRS Lessons'],
        "Children's Videos": ['Bible Cartoons', 'Alphabet Songs', 'Number Songs', 'Educational Cartoons', 'Arts & Crafts'],
        'Worksheets': ['Printable Worksheets', 'Homework Sheets', 'Practice Exercises', 'Revision Papers'],
        'Interactive Learning': ['Educational Games', 'Quizzes', 'Flash Cards', 'Puzzles', 'Memory Games'],
        'Audio Learning': ['Story Audio', 'Bible Audio', 'Pronunciation Practice', 'Reading Practice'],
    },
    'Basic 4': {
        'Textbooks': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'CRS', 'Agricultural Science', 'Home Economics'],
        'Reading Books': ['Reading Comprehension', 'Chapter Books', 'Picture Books', 'Early Readers', 'Vocabulary Practice'],
        'Story Books': ['Bible Stories', 'African Folktales', 'Adventure Stories', 'Moral Stories', 'Character Building Stories'],
        'Video Lessons': ['Mathematics Lessons', 'English Lessons', 'Science Lessons', 'Computer Lessons', 'CRS Lessons'],
        "Children's Videos": ['Bible Cartoons', 'Educational Cartoons', 'Science Experiments', 'Moral Lessons', 'Music & Dance'],
        'Worksheets': ['Printable Worksheets', 'Homework Sheets', 'Practice Exercises', 'Revision Papers'],
        'Interactive Learning': ['Educational Games', 'Quizzes', 'Flash Cards', 'Puzzles', 'Memory Games'],
        'Audio Learning': ['Story Audio', 'Bible Audio', 'Pronunciation Practice', 'Reading Practice'],
    },
    'Basic 5': {
        'Textbooks': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'CRS', 'Agricultural Science', 'Home Economics', 'Literature'],
        'Reading Books': ['Reading Comprehension', 'Chapter Books', 'Vocabulary Practice', 'Picture Books', 'Early Readers'],
        'Story Books': ['Bible Stories', 'African Folktales', 'Adventure Stories', 'Moral Stories', 'Fairy Tales'],
        'Video Lessons': ['Mathematics Lessons', 'English Lessons', 'Science Lessons', 'Computer Lessons', 'CRS Lessons'],
        "Children's Videos": ['Bible Cartoons', 'Educational Cartoons', 'Science Experiments', 'Health & Hygiene', 'Music & Dance'],
        'Worksheets': ['Printable Worksheets', 'Homework Sheets', 'Practice Exercises', 'Revision Papers'],
        'Interactive Learning': ['Educational Games', 'Quizzes', 'Flash Cards', 'Puzzles', 'Memory Games'],
        'Audio Learning': ['Story Audio', 'Bible Audio', 'Pronunciation Practice', 'Reading Practice'],
    },
}

const gradeOptions = ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5']
const resourceTypeOptions = ['All', 'Textbooks', 'Reading Books', 'Story Books', 'Video Lessons', "Children's Videos", 'Worksheets', 'Interactive Learning', 'Audio Learning']

const libraryCategories = [
    { label: 'My Library', description: 'All your saved learning resources in one place.', icon: FiBookOpen, path: '/student/library' },
    { label: 'Textbooks', description: 'Core class books for every subject and grade.', icon: FiBook, path: '/student/library/read' },
    { label: 'Reading Books', description: 'Stories and comprehension books for reading practice.', icon: FiBookmark, path: '/student/library/read' },
    { label: 'Story Books', description: 'Fun and engaging stories for early readers.', icon: FiBookOpen, path: '/student/library/read' },
    { label: 'Video Lessons', description: 'Short lessons and guided learning videos.', icon: FiPlayCircle, path: '/student/library/videos' },
    { label: "Children's Videos", description: 'Bright animated content for joyful learning.', icon: FiVideo, path: '/student/library/videos' },
    { label: 'Worksheets', description: 'Printable practice sheets and homework support.', icon: FiFileText, path: '/student/library/downloads' },
    { label: 'Learning Games', description: 'Interactive games for revision and fun.', icon: FiBookOpen, path: '/student/library/read' },
    { label: 'Downloads', description: 'PDFs and printable resources ready to use.', icon: FiDownload, path: '/student/library/downloads' },
    { label: 'Favorites', description: 'Your most-loved books and lessons.', icon: FiHeart, path: '/student/library' },
    { label: 'Continue Reading', description: 'Pick up where you left off last time.', icon: FiClock, path: '/student/library/read' },
]

export default function Library() {
    const [selectedClass, setSelectedClass] = useState('Basic 1')
    const [selectedType, setSelectedType] = useState('All')

    const visibleResources = selectedType === 'All'
        ? Object.entries(classResources[selectedClass])
        : Object.entries(classResources[selectedClass]).filter(([type]) => type === selectedType)
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">Student Library</p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">Digital learning hub for Basic 1–5</h1>
                    <p className="mt-3 max-w-2xl text-lg text-slate-400">Explore textbooks, storybooks, worksheets, video lessons, and practice resources in one place.</p>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    <FiSearch />
                    <input className="w-full bg-transparent outline-none" placeholder="Search books" />
                </div>
            </div>

            <section className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Featured Resources</h2>
                        <p className="mt-2 text-sm text-slate-400">A curated set of books and lessons for active learning.</p>
                    </div>
                    <Link to="/student/library/my-books" className="rounded-full border border-blue-400/40 px-4 py-2 text-sm font-semibold text-blue-300">View My Books</Link>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {featuredBooks.map((book) => (
                        <div key={book.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">{book.type}</span>
                                <FiHeart className="text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">{book.title}</h3>
                            <p className="mt-2 text-sm text-slate-400">{book.level}</p>
                            <p className="mt-3 text-sm leading-6 text-slate-400">{book.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                                <span className="rounded-full border border-slate-700 px-3 py-1">Read Online</span>
                                <span className="rounded-full border border-slate-700 px-3 py-1">Download</span>
                                <span className="rounded-full border border-slate-700 px-3 py-1">Video</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Resource Types</h2>
                        <p className="mt-2 text-sm text-slate-400">Choose a class and a resource type to find what your child needs quickly.</p>
                    </div>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">For Basic 1–5</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {gradeOptions.map((grade) => (
                        <button
                            key={grade}
                            onClick={() => setSelectedClass(grade)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedClass === grade ? 'bg-blue-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-blue-400/40'}`}
                        >
                            {grade}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {resourceTypeOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedType === type ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-amber-400/40'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleResources.map(([type, items]) => (
                        <div key={type} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                            <h3 className="text-lg font-semibold text-white">{type}</h3>
                            <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                {items.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Library Tools</h2>
                        <p className="mt-2 text-sm text-slate-400">Choose a quick place to start reading, learning, or revising.</p>
                    </div>
                    <Link to="/student/library/read" className="rounded-full border border-blue-400/40 px-4 py-2 text-sm font-semibold text-blue-300">Continue Reading</Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {libraryCategories.map((tool) => {
                        const Icon = tool.icon
                        return (
                            <Link key={tool.label} to={tool.path} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-blue-400/40 hover:bg-slate-900">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-300">
                                    <Icon size={20} />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-white">{tool.label}</p>
                                <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
