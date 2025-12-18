import questions from '../assets/questions.json';

export default function handler(req: any, res: any) {
  res.status(200).json(questions);
}
