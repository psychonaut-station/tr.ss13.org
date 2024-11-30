'use client';

import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type NumberInputProps = {} & React.InputHTMLAttributes<HTMLInputElement>;

export const NumberInput = forwardRef((props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

	const min = props.min;
	const max = props.max;
	const onChange = props.onChange;

	useEffect(() => {
		const preventScroll = (event: Event) => {
			if (inputRef.current && event.target === inputRef.current) {
				event.preventDefault();
				event.stopPropagation();

				const deltaY = (event as WheelEvent).deltaY > 0 ? -1 : 1;
				const value = Number(inputRef.current.value) + deltaY;

				if (
					(min !== undefined && value < Number(min)) ||
					(max !== undefined && value > Number(max))
				) {
					return;
				}

				inputRef.current.value = String(value);

				onChange?.({
					target: inputRef.current,
					currentTarget: inputRef.current,
					persist: () => {},
					stopPropagation: () => {},
					preventDefault: () => {},
				} as React.ChangeEvent<HTMLInputElement>);
			}
		};

		document.body.firstChild!.addEventListener('wheel', preventScroll, { passive: false });

		return () => {
			document.body.firstChild!.removeEventListener('wheel', preventScroll);
		};
	}, [min, max, onChange]);

	return (
		<input
			{...props}
			className={[props.className, 'bg-transparent outline-none text-center caret-white transition-opacity'].join(' ')}
			ref={inputRef}
			type="number"
		/>
	);
});

NumberInput.displayName = 'NumberInput';
