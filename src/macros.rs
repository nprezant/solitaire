// Use this to implement core::fmt::Display for a type using
// the type's debug string representation.
macro_rules! ez_display {
    ($struct_name:ident) => {
        impl core::fmt::Display for $struct_name {
            fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
                write!(f, "{:?}", self)
                // or, alternatively:
                // fmt::Debug::fmt(self, f)
            }
        }
    };
}
pub(crate) use ez_display;
