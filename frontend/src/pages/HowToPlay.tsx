import ringImg from "../assets/ring.png";
import ringEdgeImg from "../assets/ring_edge.png";
import bridgeImg from "../assets/bridge.png";
import bridgeAnyImg from "../assets/bridge_any.png";
import forkImg from "../assets/fork.png";

export function HowToPlay() {
  // Separate goal section
  const goalSection = {
    title: "Goal of Havannah",
    description:
      "Havannah is an abstract strategy board game. The goal is to complete one of three types of structures: a Ring, a Bridge, or a Fork. Players take turns placing their tiles on empty hexes, trying to achieve one of these while blocking their opponent.",
  };

  const sections = [
    {
      title: "How to Make a Ring",
      image: ringImg,
      description:
        "A Ring is formed when you connect your tiles in a closed loop. Note: a ring cannot include the edges of the board; only fully internal loops count.",
    },
    {
      title: "Ring on Edges Do Not Count",
      image: ringEdgeImg,
      description:
        "If a ring touches the edge of the board, it does not count as a valid win. Rings must be fully internal to the board.",
    },
    {
      title: "How to Make a Bridge",
      image: bridgeImg,
      description:
        "A Bridge connects any two corners of the board with your tiles.",
    },
    {
      title: "Any two corners connected count for a bridge",
      image: bridgeAnyImg,
      description:
        "The path can go in any direction and does not need to be straight.",
    },
    {
      title: "How to Make a Fork",
      image: forkImg,
      description:
        "A Fork is formed by connecting three edges of the board with your tiles. The edges can be any three, and the paths can twist as needed.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center gap-12">
      <h1 className="text-4xl font-bold mb-8">How to Play Havannah</h1>

      {/* Goal section */}
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-semibold mb-2">{goalSection.title}</h2>
        <p className="text-lg">{goalSection.description}</p>
      </div>

      {/* 3x2 grid for the rest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-4"
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full rounded-xl shadow-lg"
            />
            <div className="text-center text-lg">
              <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
              <p className="text-base">{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
