import mongoose, { Model, Document } from 'mongoose';
import { CurrencyTypes } from '../utils/enums/currency-types';

export interface IConversion {
  _id?: mongoose.Types.ObjectId;
  user: number;
  convert_from_type: CurrencyTypes;
  convert_from_value: Number;
  convert_to_type: CurrencyTypes;
  convert_to_value: Number;
  conversion_rate: Number;
  created_at: Date;
}

const schema = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true
    },
    convert_from_type: {
      type: String,
      required: true
    },
    convert_from_value: {
      type: Number,
      required: true
    },
    convert_to_type: {
      type: String,
      required: true
    },
    conversion_rate: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false
    },
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

interface ConversionModel extends Document, Omit<IConversion, '_id'> {}

export const Conversion: Model<ConversionModel> = mongoose.model(
  'Conversion',
  schema
);
