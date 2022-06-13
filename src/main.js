import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		diagramName: 'Diagrams Demo'
	}
});

export default app;
