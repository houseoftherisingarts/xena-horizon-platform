import { useState } from 'react';
interface PlageHoraire { de: string; a: string; }
const [x] = useState<Record<string, PlageHoraire[]>>({});
Object.entries(x).map(([k, v]: [string, PlageHoraire[]]) => v.length);
