// import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Banners() {
  return (
    <div className="relative overflow-hidden bg-[#1B4560] h-10">
      <div class="container mx-auto px-4 h-full">
        <div className="relative flex items-center h-full"> 

          {/* <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div> */}

          <div className="w-3/5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-white">
                <strong className="font-semibold">
                  Developed and Managed by : IT CELL, MPMKVVCL BHOPAL
                </strong>
                <svg
                  viewBox="0 0 2 2"
                  aria-hidden="true"
                  className="mx-2 inline size-0.5 fill-current"
                >
                  <circle r={1} cx={1} cy={1} />
                </svg>
                म.प्र.म.क्षे.वि.वि.कं.लि.,भोपाल (<b> उच्चदाब संयोजन पोर्टल </b>)
              </p>
            </div>
          </div>

          <div className="w-2/5 text-right">
            <a href="#" className="text-white">
              Helpline : 0755-2551222 / 1912
              {/* <span aria-hidden="true">&rarr;</span> */}
            </a>
            {/* <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:-outline-offset-4">
          <span className="sr-only">Dismiss</span> 
        </button>
      </div>  */}
          </div>
 
        </div>
      </div>
    </div>
  );
}
