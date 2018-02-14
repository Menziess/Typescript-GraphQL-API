
import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
	name: String,
	email: String,
	password: String
}, { collection: 'User' });

export default mongoose.model('User', schema);
