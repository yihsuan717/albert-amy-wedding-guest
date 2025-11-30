<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
    <!-- Layer 1：主底色（非常乾淨的象牙白）-->
    <div class="absolute inset-0 bg-[#faf8f3]"></div>
    <!-- Layer 2：中央聚光燈（主視覺，大型 spotlight）-->
    <div class="absolute top-[30%] left-1/2 -translate-x-1/2
           w-[95vw] h-[95vw]
           rounded-full
           bg-[radial-gradient(circle,rgba(255,250,240,0.92),transparent_72%)]
           blur-[48px] opacity-80">
    </div>
    <!-- Layer 3：香檳金頂部燈條（天井光）-->
    <div class="absolute top-0 left-0 w-full h-[95px]
           bg-[linear-gradient(to_bottom,rgba(225,200,150,0.42),transparent)]
           blur-[22px] opacity-80">
    </div>
    <!-- Layer 4：底部暖金反射光（地面 bounce light）-->
    <div class="absolute bottom-0 left-0 w-full h-[150px]
           bg-[radial-gradient(circle_at_bottom,rgba(205,180,130,0.26),transparent_75%)]
           blur-[50px] opacity-70">
    </div>
  </div>
</template>
