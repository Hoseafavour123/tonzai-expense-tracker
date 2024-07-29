type props = {
  progress: number
}

const FileLoader = ({ progress }: props) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-gray-200">
        {Math.round(progress) > 0 && <> {`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 min-w-[40px] bg-green-500 animate-ping rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-blue-600 blur-xl"></div>
      </div>
    </div>
  )
}

export default FileLoader
