export default function Avatar({ src, alt = '', size = 32, className = '' }) {
  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: '50%' }}
    >
      <img
        src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`;
        }}
      />
    </div>
  );
}