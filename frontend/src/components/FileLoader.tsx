type props = {
  progress: number
}

const FileLoader = ({ progress }: props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-black mt-7">
        {Math.round(progress) > 0 && <> {`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
        <div className="absolute inset rounded-full bg-blue-600 blur-xl"></div>
      </div>
    </div>
  )
}

export default FileLoader
