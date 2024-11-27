import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { X, Plus } from 'lucide-react';

const SkillsSelector = ({ 
  skills: initialSkills, 
  showAllSkills, 
  setShowAllSkills, 
  t,
  session,
  onRefresh,
  onSkillsChange
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [allSkills, setAllSkills] = useState(initialSkills);
  const [skillsToDelete, setSkillsToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState([]);

  useEffect(() => {
    setAllSkills(initialSkills);
  }, [initialSkills]);

  const handleSkillToggle = (skill) => {
    setSkillsToDelete(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmedSkill = newSkill.trim();
    
    if (trimmedSkill && !allSkills.includes(trimmedSkill)) {
      // อัพเดท UI ทันที
      const updatedSkills = [...allSkills, trimmedSkill];
      setAllSkills(updatedSkills);
      onSkillsChange?.(updatedSkills); // แจ้ง parent component
      setNewSkill('');
      
      try {
        setIsLoading(true);
        const response = await fetch("/api/student/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            skill: trimmedSkill
          }),
        });

        if (!response.ok) {
          // ถ้าเกิด error ให้ revert การเปลี่ยนแปลง
          const revertedSkills = allSkills.filter(s => s !== trimmedSkill);
          setAllSkills(revertedSkills);
          onSkillsChange?.(revertedSkills);
          throw new Error('Failed to add skill');
        }

        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error adding skill:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (skillsToDelete.length === 0) return;

    // อัพเดท UI ทันที
    const updatedSkills = allSkills.filter(skill => !skillsToDelete.includes(skill));
    setAllSkills(updatedSkills);
    onSkillsChange?.(updatedSkills); // แจ้ง parent component
    const deletedSkills = [...skillsToDelete];
    setSkillsToDelete([]);

    try {
      setIsLoading(true);
      const response = await fetch("/api/student/skills", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          skills: deletedSkills
        }),
      });

      if (!response.ok) {
        // ถ้าเกิด error ให้ revert การเปลี่ยนแปลง
        setAllSkills(prev => [...prev, ...deletedSkills]);
        onSkillsChange?.(allSkills); // revert parent state
        setSkillsToDelete(deletedSkills);
        throw new Error('Failed to delete skills');
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showAllSkills && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ease-out"
            style={{
              transform: `translate(-50%, -50%) scale(${showAllSkills ? "1" : "0.9"})`,
              opacity: showAllSkills ? 1 : 0,
            }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {t("nav.profile.allskill")}
              </h3>
              <button
                onClick={() => setShowAllSkills(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close popup"
                disabled={isLoading}
              >
                <MdClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddSkill} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t("nav.profile.addskill")}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1E48] text-white rounded-lg hover:bg-[#162d61] transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Plus size={20} />
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {allSkills.map((skill, index) => {
                  const isSelected = skillsToDelete.includes(skill);
                  const isPending = pendingUpdates.some(
                    update => (update.type === 'add' && update.skill === skill) ||
                    (update.type === 'delete' && update.skills.includes(skill))
                  );
                  
                  return (
                    <div
                      key={index}
                      onClick={() => !isLoading && handleSkillToggle(skill)}
                      className={`
                        flex items-center gap-2 rounded-full transition-all duration-200 pr-2 cursor-pointer
                        ${isSelected ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                        ${isLoading || isPending ? 'opacity-50' : ''}
                      `}
                    >
                      <span className="px-4 py-1 text-white">
                        {skill}
                        {isPending && '...'}
                      </span>
                      <X 
                        size={16} 
                        className={`text-white transition-opacity duration-200
                          ${isSelected ? 'opacity-100' : 'opacity-60'}
                        `}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {skillsToDelete.length > 0 && (
              <div className="p-6 border-t flex justify-center">
                <button
                  onClick={handleDeleteSelected}
                  className="w-full font-bold py-2 bg-[#0B1E48] hover:bg-[#162d61] text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? t("nav.profile.d") : `${t("nav.profile.delete")} ${skillsToDelete.length} ${t("nav.profile.selected")}`}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SkillsSelector;