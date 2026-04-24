import { Plus, Trash } from 'lucide-react';
import type { ingType } from '../types/type.ts';

type RefCardProps = {
    ing: ingType;
    catId: number;
    catName: string;
    type: "add" | "delete";
    onClick: (ingId: number) => void;
}

function RefCard({ ing, catId, catName, type, onClick }: RefCardProps) {

    return (
        <div key={ing.ing_id} className="card">
            <p className={`cat-name cat-${catId}`}>{catName}</p>
            <hr />
            <div className="inner-wrap">
                <p className='name'>{ing.ing_name}</p>
                <div className="btn-container">
                    <button className={`btn btn-sub ${type}`} onClick={() => onClick(ing.ing_id)}>
                        <span className='lucide-icon'>
                            {type === "add" ? <Plus /> : <Trash />}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RefCard;
