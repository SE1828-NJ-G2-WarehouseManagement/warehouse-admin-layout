/**
 * component for analysis
 *
 * @param {string} label         the label of the analysis
 * @param {number} total         the total of the analysis
 * @param {React.ReactNode} icon the icon of the analysis
 * @param {string} desc          the description of the analysis
 * @returns
 */

const Analysis = ({ label, total, icon, desc }) => {
  return (
    <div className="w-full flex flex-col justify-between rounded-2xl p-10 border-2 border-[#2593fc] hover:scale-105 ease-in-out duration-150 cursor-pointer">
      <div className="flex items-center justify-between">
        {/* left side */}
        <div>
          <span className="font-base text-xl capitalize font-medium">{label}</span>
          <h3 className="text-3xl font-bold">{total}</h3>
        </div>

        {/* right side */}
        <div className="size-10 rounded-full bg-[#E6F4FF] flex items-center justify-center">
            {icon}
        </div>
      </div>

      {/* description */}
      <p className="mt-4">
        {desc}
      </p>
    </div>
  );
};

export default Analysis;
