import { FiBook, FiBookOpen, FiAward, FiUsers, FiStar } from 'react-icons/fi'
import SectionHeading from '../components/SectionHeading'

const features = [
  {
    icon: FiBookOpen,
    title: 'Balanced Curriculum',
    description: 'We blend core academic subjects with arts, technology, and life skills to nurture well-rounded learners.',
  },
  {
    icon: FiBook,
    title: 'Experienced Faculty',
    description: 'Our teachers are qualified, passionate mentors who inspire critical thinking and curiosity.',
  },
  {
    icon: FiAward,
    title: 'Learner-Centered Approach',
    description: 'Teaching methods adapt to how each student learns best, fostering confidence and independence.',
  },
  {
    icon: FiStar,
    title: 'Academic Excellence',
    description: 'Through goal-setting and regular assessment, we track progress and celebrate success.',
  },
  {
    icon: FiUsers,
    title: 'Community Engagement',
    description: 'Service projects and leadership opportunities prepare students to be agents of positive change.',
  },
]

export default function Academics() {
  return (
    <main className="space-y-20 pb-16">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Academics"
          title="A culture of excellence and discovery"
          description="At Royal Higherlife Schools, our academic program is designed to challenge, engage, and empower every learner to reach their full potential."
          align="center"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex flex-col rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400 flex-1">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
