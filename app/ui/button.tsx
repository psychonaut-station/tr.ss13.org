type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	active?: boolean;
};

export default function Button({ children, className, active }: ButtonProps) {
	return (
		<div className={`${className ? className + ' ' : ''}${active ? 'bg-opacity-15 hover:bg-opacity-20' : 'bg-opacity-5 hover:bg-opacity-10'} bg-white transition-colors border border-white border-opacity-10 px-3 py-2 rounded-[.25rem]`}>
			{children}
		</div>
	);
}
