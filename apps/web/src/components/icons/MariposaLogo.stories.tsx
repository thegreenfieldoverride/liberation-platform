import type { Story } from '@ladle/react';

export default {
  title: 'Liberation Platform / Branding',
};

export const LogoSizes: Story = () => (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Mariposa Logo</h1>
      
      <div className="space-y-8">
        {/* Size Variants */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Size Variants</h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <img src="/mariposa-black.png" alt="Mariposa" width={24} height={24} />
              <p className="text-xs text-gray-600 mt-2">24px</p>
            </div>
            <div className="text-center">
              <img src="/mariposa-black.png" alt="Mariposa" width={32} height={32} />
              <p className="text-xs text-gray-600 mt-2">32px</p>
            </div>
            <div className="text-center">
              <img src="/mariposa-black.png" alt="Mariposa" width={40} height={40} />
              <p className="text-xs text-gray-600 mt-2">40px (default)</p>
            </div>
            <div className="text-center">
              <img src="/mariposa-black.png" alt="Mariposa" width={64} height={64} />
              <p className="text-xs text-gray-600 mt-2">64px</p>
            </div>
            <div className="text-center">
              <img src="/mariposa-black.png" alt="Mariposa" width={96} height={96} />
              <p className="text-xs text-gray-600 mt-2">96px</p>
            </div>
          </div>
        </div>

        {/* Light Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">On Light Background</h3>
          <div className="bg-white p-8 rounded border flex items-center gap-4">
            <img src="/mariposa-black.png" alt="Mariposa" width={48} height={48} />
            <span className="text-2xl font-bold text-gray-900">Liberation Platform</span>
          </div>
        </div>

        {/* Dark Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">On Dark Background</h3>
          <div className="bg-gray-900 p-8 rounded flex items-center gap-4">
            <img src="/mariposa-black.png" alt="Mariposa" width={48} height={48} className="brightness-0 invert" />
            <span className="text-2xl font-bold text-white">Liberation Platform</span>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">On Gradient Background</h3>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded flex items-center gap-4">
            <img src="/mariposa-black.png" alt="Mariposa" width={48} height={48} className="brightness-0 invert" />
            <span className="text-2xl font-bold text-white">Liberation Platform</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const LogoInContext: Story = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Navigation Bar */}
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/mariposa-black.png" alt="Mariposa" width={36} height={36} />
          <span className="text-xl font-bold text-gray-900">Liberation Platform</span>
        </div>
        <div className="flex gap-6 text-gray-600">
          <a href="#" className="hover:text-gray-900">Tools</a>
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Support</a>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <img src="/mariposa-black.png" alt="Mariposa" width={120} height={120} className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Break Free from Corporate Burnout
        </h1>
        <p className="text-xl text-gray-600">
          The Mariposa butterfly symbolizes transformation and liberation
        </p>
      </div>
    </section>
  </div>
);