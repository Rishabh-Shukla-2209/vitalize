const Stats = ({ value, title }: { value: number; title: string }) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-around gap-1 min-h-25 border border-zinc-300 dark:border-sage-700 rounded-md bg-zinc-100 dark:bg-sage-400">
      <p className="text-3xl font-semibold">{value}</p>
      <p>{title}</p>
    </div>
  );
};

export default Stats;
