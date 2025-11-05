
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/excel-preview" | "/preview" | "/report" | "/report/department" | "/report/department/[dept]" | "/report/individual" | "/report/individual/[id]" | "/report/organization";
		RouteParams(): {
			"/report/department/[dept]": { dept: string };
			"/report/individual/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { dept?: string; id?: string };
			"/excel-preview": Record<string, never>;
			"/preview": Record<string, never>;
			"/report": { dept?: string; id?: string };
			"/report/department": { dept?: string };
			"/report/department/[dept]": { dept: string };
			"/report/individual": { id?: string };
			"/report/individual/[id]": { id: string };
			"/report/organization": Record<string, never>
		};
		Pathname(): "/" | "/excel-preview" | "/excel-preview/" | "/preview" | "/preview/" | "/report" | "/report/" | "/report/department" | "/report/department/" | `/report/department/${string}` & {} | `/report/department/${string}/` & {} | "/report/individual" | "/report/individual/" | `/report/individual/${string}` & {} | `/report/individual/${string}/` & {} | "/report/organization" | "/report/organization/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}