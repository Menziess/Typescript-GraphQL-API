
import App from './App';

const app = App.express;
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';

app.listen(port, () => {
	console.info('Server listening on http://localhost:' + port + ', Ctrl+C to stop');
});

export { App };
