interface RulerProps {
  measureWidth: number;
  totalMeasures: number;
  beatsPerMeasure: number;
}

export const Ruler = ({
  measureWidth,
  totalMeasures,
  beatsPerMeasure,
}: RulerProps) => {
  const renderRulerMarks = () => {
    let marks = [];
    for (let i = 0; i < totalMeasures; i++) {
      // Gros trait pour chaque mesure
      marks.push(
        <div
          key={`measure-${i}`}
          className="absolute border-l border-gray-400 "
          style={{ left: `${i * measureWidth}px`, height: "100%" }}
        >
          <div className="ml-2 text-gray-400">{i + 1}</div>
        </div>
      );

      // Petits traits pour les temps
      for (let j = 1; j < beatsPerMeasure; j++) {
        marks.push(
          <div
            key={`beat-${i}-${j}`}
            className="absolute border-l border-gray-400"
            style={{
              left: `${
                i * measureWidth + j * (measureWidth / beatsPerMeasure)
              }px`,
              height: "30%",
            }}
          ></div>
        );
      }
    }
    return marks;
  };

  return (
    <div
      className="relative h-10 bg-shade-700 flex items-end"
      style={{ width: `${totalMeasures * measureWidth}px` }}
    >
      {renderRulerMarks()}
    </div>
  );
};

export default Ruler;
