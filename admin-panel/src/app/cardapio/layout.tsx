export default function CardapioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-hidden w-full flex flex-col font-sans">
      {children}
    </div>
  )
}
