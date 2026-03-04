import { useState } from 'react';
import { mockCertificates, mockCourses } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CertificateModal } from '../components/CertificateModal';
import { Certificate } from '../types';
import { Award, Download, Eye } from 'lucide-react';

export function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showModal, setShowModal] = useState(false);

  // In a real app, this would filter certificates by current user
  const userCertificates = mockCertificates;

  const handleViewCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl">My Certificates</h1>
        <p className="text-gray-600">View and download your earned certificates</p>
      </div>

      {/* Certificates Grid */}
      {userCertificates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userCertificates.map((cert) => {
            const course = mockCourses.find(c => c.id === cert.courseId);
            if (!course) return null;

            return (
              <Card key={cert.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-600 p-6 flex items-center justify-center">
                  <Award className="size-16 text-white opacity-20 absolute" />
                  <div className="relative text-center text-white">
                    <Award className="size-12 mx-auto mb-2" />
                    <p className="text-sm">Certificate of Completion</p>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium line-clamp-2">{cert.courseName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Issued: {cert.completedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Instructor: {cert.instructor}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleViewCertificate(cert)}
                    >
                      <Eye className="size-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => console.log('Download certificate')}
                    >
                      <Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Award className="size-16 text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">No Certificates Yet</h3>
            <p className="text-sm text-gray-600 text-center max-w-md">
              Complete courses to earn certificates. Certificates are awarded when you finish all lessons and quizzes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
}
