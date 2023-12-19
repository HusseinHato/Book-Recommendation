export default function Page({ params }: { params: { ISBN: string } }) {
    return <div className="text-white">BOOK ISBN: {params.ISBN}</div>
  }