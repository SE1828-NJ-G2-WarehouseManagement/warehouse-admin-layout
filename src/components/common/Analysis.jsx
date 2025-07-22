/**
 * Refined Analysis Card Layout
 *
 * @param {string} label         Title of the analysis
 * @param {number|string} total  Total value
 * @param {React.ReactNode} icon Icon node
 * @param {string} desc          Description text
 */

const Analysis = ({ label, total, icon, desc }) => {
  return (
    <div className="w-full h-full flex flex-col items-center text-center rounded-2xl border border-[#2593fc] p-6 md:p-8 shadow-sm bg-white transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer">
      
      {/* Total number (large and bold) */}
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#0f172a]">{total}</h3>

      {/* Small icon below number */}
      <div className="w-8 h-8 mt-3 flex items-center justify-center rounded-full bg-[#E6F4FF] shadow-inner">
        <span className="text-base text-[#2593fc]">{icon}</span>
      </div>

      {/* Label */}
      <h4 className="text-base md:text-lg font-semibold text-[#1d4ed8] mt-4">{label}</h4>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mt-1 px-2">{desc}</p>
    </div>
  );
};

export default Analysis;
