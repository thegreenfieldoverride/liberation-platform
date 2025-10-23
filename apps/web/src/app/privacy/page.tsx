import { LibIcon } from '../../components/icons/LiberationIcons';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LibIcon icon="Privacy" size="xl" className="text-green-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Privacy Promise
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your data is yours. Period. We built these tools to liberate you from corporate surveillance, 
            not to become another data harvester.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Our Radical Approach to Privacy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <LibIcon icon="Privacy" size="md" className="text-green-600 mr-2" />
                Zero Server-Side Storage
              </h3>
              <p className="text-gray-600 mb-4">
                Every calculation happens in your browser. We literally cannot see your data because it never leaves your device.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• All tools run 100% client-side</li>
                <li>• No databases storing your information</li>
                <li>• No cloud sync or backups</li>
                <li>• Your data stays on your machine</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <LibIcon icon="Settings" size="md" className="text-blue-600 mr-2" />
                No Tracking, Ever
              </h3>
              <p className="text-gray-600 mb-4">
                We don't use Google Analytics, Facebook Pixel, or any tracking scripts. We don't even know you visited.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• No cookies for tracking</li>
                <li>• No behavioral analytics</li>
                <li>• No user fingerprinting</li>
                <li>• No third-party scripts</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center">
              <LibIcon icon="Direction" size="md" className="text-green-600 mr-2" />
              How We Keep This Promise
            </h3>
            <p className="text-green-700 mb-4">
              This isn't just a policy—it's how our tools are architecturally designed. 
              Here's the technical proof:
            </p>
            <ul className="text-sm text-green-600 space-y-2">
              <li>• All calculations use JavaScript running in your browser</li>
              <li>• Data is stored only in localStorage (on your device)</li>
              <li>• No API calls send your personal information</li>
              <li>• Open source code you can audit yourself</li>
              <li>• Self-hostable—run it on your own server</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">What We Do Collect (Spoiler: Almost Nothing)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Server Logs</h3>
              <p className="text-gray-600 mb-3">
                Our web server keeps minimal logs for security and performance, automatically deleted after 30 days:
              </p>
              <ul className="text-sm text-gray-500 space-y-1 ml-4">
                <li>• IP address (for DDoS protection)</li>
                <li>• Timestamp of page requests</li>
                <li>• Browser type (for compatibility)</li>
                <li>• No personally identifiable information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What We Never Collect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Your salary or financial information</li>
                  <li>• Assessment results or scores</li>
                  <li>• Personal values or career preferences</li>
                  <li>• Email addresses or contact info</li>
                </ul>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Location or demographic data</li>
                  <li>• Social media profiles</li>
                  <li>• Device fingerprints</li>
                  <li>• Browsing history or behavior</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Why This Matters for Liberation</h2>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Corporate surveillance capitalism has turned your anxiety into their profit. Every time you search 
              "how to quit my job" or "career change," that desperation becomes a data point sold to the highest bidder.
            </p>
            
            <p className="text-gray-600 mb-4">
              <strong>We refuse to participate in this system.</strong> Your journey to liberation should be private, 
              safe, and free from the very surveillance economy you're trying to escape.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Our Commitment</h3>
              <p className="text-blue-700">
                We will never monetize your data, sell your information, or use your liberation journey 
                to target ads. This platform exists to free you, not to profit from your freedom.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Verify Our Claims</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Open Source</h3>
              <p className="text-gray-600 mb-4">
                Every line of code is public. Audit our privacy claims yourself or hire someone to do it.
              </p>
              <a 
                href="https://github.com/thegreenfieldoverride/liberation-platform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <LibIcon icon="Direction" size="sm" className="mr-2" />
                View Source Code
              </a>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Self-Host</h3>
              <p className="text-gray-600 mb-4">
                Don't trust us? Run it yourself. All tools work completely offline once downloaded.
              </p>
              <a 
                href="/developers" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <LibIcon icon="Settings" size="sm" className="mr-2" />
                Developer Resources
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Questions About Privacy?</h2>
          <p className="text-gray-600 mb-6">
            This promise is fundamental to our mission. If you have concerns or questions about our privacy practices, 
            please review our open source code or reach out to the community.
          </p>
          <div className="text-sm text-gray-500">
            Last updated: October 2025 • This policy will only change to become more privacy-protective
          </div>
        </div>
      </div>
    </div>
  );
}