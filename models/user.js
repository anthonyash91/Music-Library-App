const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    password: { type: String, trim: true, minLength: 3, required: true },
    icon: { type: String, required: false },
    albums: { items: [{ type: Schema.Types.ObjectId, ref: 'Album' }] },
    likes: { items: [{ type: Schema.Types.ObjectId, ref: 'Like' }] }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('pasword')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

module.exports = model('User', userSchema);
