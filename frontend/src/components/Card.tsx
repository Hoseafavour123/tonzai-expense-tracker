type prop = {
  iconImg: { src: string; alt: string }
  title: string
  amount: number | undefined
  period: string | undefined
  avgDaily?: {percent: number | undefined, color: string}
}

const Card = ({ iconImg, title, amount, period, avgDaily }: prop) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h1 className="md:text-2xl sm:text-xl text-black mb-2">
        {title}<small className="text-xs text-gray-500"> /{period}</small>
      </h1>
      <div className="flex gap-3 items-center">
        <div className="rounded-full p-2 bg-gray-200 font-bold">
          <img src={iconImg.src} alt={iconImg.alt} width={24} height={22} />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="md:text-4xl sm:text-3xl text-black font-bold">${amount}</h1>
          <small className={`text-${avgDaily?.color}-500 font-bold`}> {avgDaily?.percent}% </small>
        </div>
      </div>
    </div>
  )
}
export default Card
