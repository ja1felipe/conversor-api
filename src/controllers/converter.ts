import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Conversion } from '../models/conversion';
import { Converter } from '../services/converter';

@Controller('converter')
export class ConverterController {
  @Post('')
  public async convert(req: Request, res: Response): Promise<void> {
    try {
      const {
        convert_from_type,
        convert_from_value,
        convert_to_type,
        user
      } = req.body;

      const converter = new Converter();
      const convertInfos = await converter.convert(
        convert_from_type,
        convert_from_value,
        convert_to_type
      );
      let conversion = new Conversion({
        ...convertInfos,
        user
      });

      await conversion.save();

      res.status(201).send({
        ...convertInfos,
        user: conversion.user,
        created_at: conversion.created_at
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }

  @Get(':id')
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.params.id;
      const conversions = await Conversion.find({ user: Number(user_id) });
      res.status(200).send(conversions);
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
