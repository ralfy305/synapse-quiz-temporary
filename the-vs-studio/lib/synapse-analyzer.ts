export type PerceptionData = {
  questionId: string;
  selfScore: number;
  partnerGuess: number;
};

export function calculatePerceptionGap(data: PerceptionData[]) {
  return data.map(item => {
    // The "Gap" is the distance between reality and perception
    const gap = Math.abs(item.selfScore - item.partnerGuess);
    
    return {
      ...item,
      gap,
      status: gap === 0 ? "✓ SYNERGY" : gap > 2 ? "!! MISMATCH" : "CAUTION",
      clinicalNote: gap > 2 
        ? "Classic perception gap: The partner is missing the subject's internal state." 
        : "Alignment detected: High emotional empathy in this sector."
    };
  });
}