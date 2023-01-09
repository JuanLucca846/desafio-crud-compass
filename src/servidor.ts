import express, { Request, Response} from "express";
import { Loja } from "./lojaInterface";
import * as Joi from 'joi'
import {
    ContainerTypes,
    
    ValidatedRequest,
    
    ValidatedRequestSchema,
    
    createValidator
  } from 'express-joi-validation'

  
const servidor = express();
servidor.use(express.json());

let lojas:Loja [] = [];

const validator = createValidator()

const createBodySchema = Joi.object({
  id: Joi.number().required().min(1),
  nomeLoja: Joi.string().required(),
  descricaoLoja: Joi.string().optional().allow(''),
  avaliacaoLoja: Joi.number().required().min(1).max(5)
})

interface HelloRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: number
    nomeLoja: string
    descricaoLoja: string
    avaliacaoLoja: number
  }
}

const updateBodySchema = Joi.object({
  nomeLoja: Joi.string().required(),
  descricaoLoja: Joi.string().optional().allow(''),
  avaliacaoLoja: Joi.number().required().min(1).max(5)
})

const updateParamsSchema = Joi.object({
  id: Joi.number().required().min(1),
})

const deleteParamsSchema = Joi.object({
    id: Joi.number().required().min(1),
})

servidor.get('/lojas', (req: Request, res: Response) => {
    try {
        return res.status(200).json(lojas);
    } catch (error) {
        return res.status(500).json({ error: error})
    }
    
    });


servidor.get('/lojas/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const encontrarLoja =  lojas.find(( loja ) => parseInt(id) === loja.id)

    if(!encontrarLoja){
        return res.status(404).json({ message: 'Loja não encontrada'})
    }

    return res.json(encontrarLoja);
    
});
    

servidor.post('/lojas', validator.body(createBodySchema), (req: ValidatedRequest<HelloRequestSchema>, res: Response) => {
    const { id, nomeLoja, descricaoLoja, avaliacaoLoja } = req.body;
    const loja:Loja = {
        id: id,
        nomeLoja: nomeLoja,
        descricaoLoja: descricaoLoja,
        avaliacaoLoja: avaliacaoLoja
    }

    try {
        lojas.push(loja);
        return res.status(201).json(lojas);
    } catch (error) {
        return res.status(500).json({ error: error})
    }
    
});

servidor.put('/lojas/:id', validator.body(updateBodySchema), validator.params(updateParamsSchema), (req: Request, res: Response) => {
    const { id } = req.params;
    const { nomeLoja, descricaoLoja, avaliacaoLoja } = req.body;
    
    const checarIdLoja = lojas.find(( Loja ) => parseInt(id) === Loja.id)
    if(!checarIdLoja){
        return res.status(404).json({ message: 'ID não encontrada'})
    }

    lojas = lojas.map(x => {
        if(parseInt(req.params.id) === x.id){
           return {
            id: parseInt(id),
            nomeLoja: nomeLoja,
            descricaoLoja: descricaoLoja,
            avaliacaoLoja: parseInt(avaliacaoLoja)
        };
        }
        return x;

    });

    return res.json(lojas);
});

servidor.delete('/lojas/:id', validator.params(deleteParamsSchema), (req: Request, res: Response) => {
    
    
    const { id } = req.params;

    
        let novasLojas = lojas.filter(x => {
            return parseInt(req.params.id) !== x.id;
        });
    
        if(novasLojas.length === lojas.length){
            return res.status(404).json({ message: 'id não encontrado'})
        }
        lojas = novasLojas;
        
        return res.json({ message: 'loja excluida'})
    
    
    
    
})

servidor.listen(3000, ()=> console.log('Servidor Online'));