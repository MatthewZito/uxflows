import { createGlobalStyle } from 'styled-components'

import { FontFamilyBase, FontFamilyCode } from './Typography/FontFamily'

export const Reset = createGlobalStyle<{
  theme: { colorbg: string; colortext: string }
}>`
body,
html {
	overflow: hidden;
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	background-color: ${({ theme }) => theme.colors.background.dark};
}

* {
	${FontFamilyBase}
}

*,
::before,
::after {
	box-sizing: border-box;
	border-width: 0;
	border-style: solid;
}

::-webkit-scrollbar {
	overflow: overlay;
	width: 8px;
}

::-webkit-scrollbar-track {
	display: initial;
}

::-webkit-scrollbar-thumb {
	background-color: ${({ theme }) => theme.colors.scrollbar.norm};
	border-radius: 9999px;
}

::selection {
	background-color: ${({ theme }) => theme.colors.interactive.norm};
}

*,
*::before,
*::after {
	box-sizing: inherit;
	padding: 0;
	margin: 0;
}

p {
	word-break: break-word;
}

img,
svg {
	display: block;
}

img,
video {
	max-width: 100%;
	height: auto;
}

button {
	cursor: pointer;
}

button,
[type='button'],
[type='reset'],
[type='submit'] {
	appearance: button;
	background-color: transparent;
	background-image: none;
}

textarea {
	${FontFamilyCode}
}

ul, ol {
	list-style: none;
}

mark {
	background-color: inherit;
	color: ${({ theme }) => theme.colors.interactive.norm};
	font-weight: 700;
}
`
