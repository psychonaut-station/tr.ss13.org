import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex-1 flex flex-col items-center gap-5">
			<span className="text-red-500">Oyuncu bulunamadı.</span>
			<Link className="underline" href="/players">Geri dön</Link>
		</div>
	);
}
