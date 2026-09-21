import Meta from '@/components/Meta';
import Item from '@/components/Micro/ARfiti';

// The route is full-bleed (see `fullBleed` in `routes/index.ts`): the map is the
// page, so the shell hands over its gutter and the module fills the frame.
function ARfiti() {
  return (
    <>
      <Meta title="ARfiti" />
      <Item />
    </>
  );
}

export default ARfiti;
