import { Plus, Trash2 } from 'lucide-react';
import type { ingType } from '../types/type.ts';

const getElaspedTime = (addedAt: string): string => {
    const addedDate = new Date(addedAt);
    const now = new Date();
    const elapsedTime = now.getTime() - addedDate.getTime();
    const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    return `${elapsedDays}日前`;
}

function RefCard({ ing, catId, catName, type, onClick }: 
    { ing: ingType, catId: number, catName: string, type: "add" | "delete", onClick: (id: number) => void }) {
    return (
        <div key={ing.ing_id} className="card inner-wrap">
            <div>
                <p className='name'>{ing.ing_name} </p>
                <p className={`cat-name cat-${catId}`}>{catName} <span className='elapsed_time'>{getElaspedTime(ing.added_at)}</span></p>
            </div>
            <div className="btn-container">
                <button className={`btn-sub ${type}`} onClick={() => onClick(ing.ing_id)}>
                    {type === "add" ? <Plus className='lucide-icon' /> : <Trash2 className='lucide-icon' />}
                </button>
            </div>
        </div>
    )
}

export default RefCard;
