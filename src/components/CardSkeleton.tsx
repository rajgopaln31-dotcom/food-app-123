import { Skeleton } from "@mui/material";

// Grey placeholder cards shown while data is loading
function CardSkeleton() {
  return (
    <div className="card-grid">
      {[1, 2, 3].map((number) => <Skeleton key={number} variant="rectangular" height={220} />)}
    </div>
  );
}
export default CardSkeleton;
