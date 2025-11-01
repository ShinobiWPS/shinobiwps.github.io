import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="dark:divide-gray-700 divide-y divide-gray-200">
        <div className="md:space-y-5 pt-6 pb-8 space-y-2">
          <h1 className="sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100 text-3xl font-extrabold leading-9 tracking-tight text-gray-900">
            Projects
          </h1>
          <p className="dark:text-gray-400 text-lg leading-7 text-gray-500"></p>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap -m-4">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
