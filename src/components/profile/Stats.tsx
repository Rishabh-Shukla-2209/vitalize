
const Stats = ({value, title}: {value: number, title: string}) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-around gap-1 min-h-25 border border-zinc-300 rounded-md bg-zinc-100">
        <p className="text-zinc-600 text-3xl font-semibold">{value}</p>
        <p className="text-zinc-600">{title}</p>
    </div>
  )
}

export default Stats