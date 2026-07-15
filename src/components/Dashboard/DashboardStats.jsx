import DashboardStatCard from './DashboardStatCard'

function DashboardStats({ stats }) {
  return (
    <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((item) => (
        <DashboardStatCard key={item.title} {...item} />
      ))}
    </section>
  )
}

export default DashboardStats
