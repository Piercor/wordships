import { useState } from "react";

interface Square {
  letter: string | null;
  revealed: boolean;
  hasWord: boolean;
}

function createEmptyGrid(): Square[][] {
  return Array.from({ length: 10 }, () =>  // skapa 10 rader
    Array.from({ length: 10 }, () => ({    // skapa 10 celler per rad
      letter: null,
      revealed: false,
      hasWord: false,
    }))
  );
}

export default function Grid() {
  const [grid] = useState<Square[][]>(createEmptyGrid);

  return (
    <div>
      Grid
    </div>
  );
}